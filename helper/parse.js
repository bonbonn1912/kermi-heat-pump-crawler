const parseFavDp = (item, favDp) => {
    return {
        sensorName: item["DisplayName"],
        sensorValue: favDp["Value"],
        deviceId: item["DeviceId"]
    }
   
}


export {
    parseFavDp
}