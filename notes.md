### Get all cards for a list of versions
```SurrealQL
SELECT * FROM rc WHERE versions CONTAINSANY ['USv1.1', 'USv1.2'];
```