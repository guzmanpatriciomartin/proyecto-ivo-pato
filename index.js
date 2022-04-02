const express = require('express')
const app = express()
const port = 3000
app.use(express.json())



app.use('/',express.static('proyecto-ivo-pato'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
var preferenciaid
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: "TEST-4552159542524891-032518-450dd7c59970dfdbe6786b256d91f39f-293197695",
});
// let preference = {
//     items: [
//       {
//         title: "Mi producto",
//         unit_price: 100,
//         quantity: 1,
//       }
//     ],
//   };
  
//   mercadopago.preferences
//     .create(preference)
//     .then(function (response) {
//        preferenciaid= response.body.id// En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
//     console.log(preferenciaid);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });

    app.use('/preferenciaid', (req, res) => {
        mercadopago.preferences
    .create(req.body)
    .then(function (response) {
        res.send(response.body.id)// En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
    })
    .catch(function (error) {
      console.log(error);
    });
      
      })