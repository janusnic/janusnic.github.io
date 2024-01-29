export class Store {

    static init(key) {
      try { 
  
          if(!Store.isset(key)) {
              Store.set(key, []); 
            //   console.log(Store.get(key));			
          }
      
      } catch(err) {
          if(err==QUOTA_EXCEEDED_ERR){
               console.log("Local Storage Limited is exceeded");
          }
      }
      return Store.get(key);
    }
  
    static get(key) {
          let value = localStorage.getItem(key);
          return value === null ? null : JSON.parse(value);
    }
  
    static set(key,value) {
          return localStorage.setItem(key,JSON.stringify(value));
    }
  
    static unset(key) {
          if(this.isset(key))
              return localStorage.removeItem(key);
          else
              return null;
    }
  
    static clear() {
          return localStorage.clear();
    }
  
    static isset(key) {
        return this.get(key) !== null;
    }
}

// export default { Store };