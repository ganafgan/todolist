import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        // saving error
        console.log(e)
    }
}


export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }  

export const clearStorage = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
      console.log(e)
    }
}
  