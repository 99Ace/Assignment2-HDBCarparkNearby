//Working Set : for extract data for carpark AVAILABILITY API
getDataFromEndpoint(function(data){
          for (let item in data){
            carparkData[item] = {
              "carpark_number" :data[item].carpark_number,
              "lot_type" : data[item].carpark_info[0]["lot_type"],
              "lots_available" : data[item].carpark_info[0]["lots_available"],
              "total_lots" : data[item].carpark_info[0]["total_lots"]
            }
          } //Working Set : Do not change
          // console.log(carparkData)
        })          

//working example for extract data from carpark lat lng
carparkData2[0] = {
              "address" :carparkAddInfo[0].address,
              "car_park_basement" : carparkAddInfo[0].car_park_basement,
              "car_park_decks" : carparkAddInfo[0].car_park_decks,
              "car_park_type" : carparkAddInfo[0].car_park_type,
              "free_parking":carparkAddInfo[0].free_parking,
              "gantry_height":carparkAddInfo[0].gantry_height,
              "night_parking":carparkAddInfo[0].night_parking,
              "short_term_parking":carparkAddInfo[0].short_term_parking,
              "type_of_parking_system":carparkAddInfo[0].type_of_parking_system,
              "x_coord":carparkAddInfo[0].x_coord,
              "y_coord":carparkAddInfo[0].y_coord
            } 
//****
// carparkData= [
//   {
//     "lot_type" : data[0].carpark_info[0]["lot_type"],
//     "lots_available" : data[0].carpark_info[0]["lots_available"],
//     "total_lots" : data[0].carpark_info[0]["total_lots"],
//     "carpark_number" :data[0].carpark_number
//   },
// ]
// console.log(carparkAddInfo)
// $("#entry-box").append(`${data["0"].carpark_info["0"].lot_type}`)
// $("#entry-box").append(`<p>${data[0].carpark_info[0].total_lots}</p>`)
// $("#entry-box").append(`<p>${data[0].carpark_number}</p>`)


//Working example for extract data to own array
for (let item in carparkAddInfo){
          carparkData2[item] = {
            "address" :carparkAddInfo[item].address,
            "car_park_basement" : carparkAddInfo[item].car_park_basement,
            "car_park_decks" : carparkAddInfo[item].car_park_decks,
            "car_park_type" : carparkAddInfo[item].car_park_type,
            "free_parking":carparkAddInfo[item].free_parking,
            "gantry_height":carparkAddInfo[item].gantry_height,
            "night_parking":carparkAddInfo[item].night_parking,
            "short_term_parking":carparkAddInfo[item].short_term_parking,
            "type_of_parking_system":carparkAddInfo[item].type_of_parking_system,
            "x_coord":carparkAddInfo[item].x_coord,
            "y_coord":carparkAddInfo[item].y_coord
          } 
        }

// testing Object.assign - working set
      // var x = [{"a":"b"},{"a":"b"},{"a":"b"}]
      // Object.assign(x[0],{"c":"d"})
      // var x = new carparkData