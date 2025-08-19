module.exports = (app, mysql) => {
    app.post('/repertoire_data', (request, response) => {

        if(request.body.search_item === undefined){
            response.end();
            return;
        }

        let author, title, query;

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
            query = `SELECT DISTINCT repertoire.id AS music_id, repertoire.*, events.id AS event_id, events.*
            FROM repertoire
            LEFT OUTER JOIN events ON repertoire.best_music_event = events.id
            WHERE author LIKE ?
            AND title LIKE ?
            ORDER BY surname, author, title`;
        }
        else{
            author = request.body.search_item;
            title = request.body.search_item;
            query = `SELECT DISTINCT repertoire.id AS music_id, repertoire.*, events.id AS event_id, events.*
            FROM repertoire
            LEFT OUTER JOIN events ON repertoire.best_music_event = events.id
            WHERE author LIKE ?
            OR title LIKE ?
            ORDER BY surname, author, title`;
        }

        author = '%' + author + '%';
        title = '%' + title + '%';

        db.query(query, [author, title], function (err, result){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });
}