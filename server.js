const express = require('express');
const https = require('https');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(express.static('public')); // Para servir archivos estáticos desde la carpeta 'public'
app.use(cors());


app.get('/buscarMedicamento', (req, res) => {
    const { nombre } = req.query; // Cambio a búsqueda por nombre

    if (!nombre) {
        return res.status(400).send('Se requiere el nombre del medicamento');
    }

    // Nota: Esta URL es hipotética, necesitas ajustarla según la funcionalidad real de la API
    const url = `https://cima.aemps.es/cima/rest/medicamentos?nombre=${encodeURIComponent(nombre)}`;

    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            res.json(JSON.parse(data)); // Envía la respuesta como JSON
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.status(500).send('Error al obtener los datos del medicamento');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
