module.exports = function (apiRouter, mysql, fs) {
apiRouter.post('/events_data', function(request, response) {

        if(request.body.search_item === undefined){
            response.end();
            return;
        }

        let author, title;

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        //author: title
        if(request.body.search_item.includes(':')){
            let splitted_search_item = request.body.search_item.split(':');
            author = splitted_search_item[0].trim();
            title = splitted_search_item[1].trim();

            title = '%' + title + '%';
            author = '%' + author + '%';

            db.query(`SELECT DISTINCT events.* FROM events
                    LEFT OUTER JOIN music_to_events
                    ON  music_to_events.event = events.id
                    LEFT OUTER JOIN repertoire
                    ON  music_to_events.music = repertoire.id
                    WHERE repertoire.title LIKE ?
                    AND repertoire.author LIKE ?
                    ORDER BY events.date DESC, events.place`,
            [title, author],
            function (err, result, fields){
                if(err) throw err;
                response.send(result);
                db.end();
            });
        }
        else{
            let search_item = '%' + request.body.search_item + '%';

            db.query(`SELECT DISTINCT events.* FROM events
                    LEFT OUTER JOIN music_to_events
                    ON  music_to_events.event = events.id
                    LEFT OUTER JOIN repertoire
                    ON  music_to_events.music = repertoire.id
                    WHERE events.place LIKE ?
                    OR events.event LIKE ?
                    OR events.date LIKE ?
                    OR repertoire.title LIKE ?
                    OR repertoire.author LIKE ?
                    ORDER BY events.date DESC, events.place`,
            [search_item, search_item, search_item, search_item, search_item],
            function (err, result, fields){
                if(err) throw err;
                response.send(result);
                db.end();
            });
        }
    });

    apiRouter.post('/music_to_event', function(request, response){

        if(request.body.event_id === undefined ){
            response.end();
            return;
        }

        const event_id = parseInt(request.body.event_id);

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT DISTINCT repertoire.* FROM repertoire
                    LEFT OUTER JOIN music_to_events
                    ON music_to_events.music = repertoire.id
                    WHERE music_to_events.event = ?
                    ORDER BY repertoire.author, repertoire.title`,
        [event_id],
        function (err, result, fields){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });

    apiRouter.post('/get_local_images', async (request, response) => {

        if(isNaN(request.body.event_id)){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        let event_id = request.body.event_id;

        if(parseInt(event_id) === -2){
            //home gallery
            let images = [];
            let folder = `./public/img/mandakhaz/`;

            await fs.readdirSync(folder).forEach(file => {
                images.push({
                    "image": `/img/mandakhaz/${file}`,
                    "name": file
                });
            });

            response.send(images);
        }else if(parseInt(event_id) === -1){
            //home gallery
            let images = [];
            let folder = `./public/events/gallery/`;

            await fs.readdirSync(folder).forEach(file => {
                images.push({
                    "image": `/events/gallery/${file}`,
                    "name": file
                });
            });

            response.send(images);
        }else{
            //events gallery
            db.query(`SELECT local_folder FROM events WHERE id = ?`,
                [parseInt(event_id)], async (err, events_result) => {
                    if(err) throw err;

                    if(events_result[0].local_folder === null || events_result[0].local_folder === ''){
                        response.end();
                        db.end();
                        return;
                    }

                    let images = [];
                    // let folder = `/assets/events/${events_result[0].local_folder}/images/`;
                    let folder = `../client/src/assets/events/${events_result[0].local_folder}/images/`;

                    try {
                        await fs.readdirSync(folder).forEach(file => {
                            images.push({
                                "image_url": `/events/${events_result[0].local_folder}/images/${file}`,
                                "image_name": file
                            });
                        });
                        response.send(images);
                    } catch (error){
                        console.log(error);
                        response.send([]);
                    } finally {
                        db.end();
                    }

                });
        }
    });
}