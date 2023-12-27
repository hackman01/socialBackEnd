const AuthReducer = (state,action)=>{
    switch(action.type){
      case "LOGIN_START" : 
         return {
            user:null,
            isFetching:true,
            error:false
         };

         case "LOGIN_SUCCESS" : 
         return {
            user:action.payload,
            isFetching:false,
            error:false
         };

         case "LOGIN_FAILURE" : 
         return {
            user:null,
            isFetching:false,
            error:action.error
         };

         case "FOLLOW" :
            return {
               ...state,
               user : {
                   ...state.user,
                   followings : [...state.user.followings,action.payload]
               }
            };

            case "UNFOLLOW" :
               return {
                  ...state,
                  user : {
                     ...state.user,
                     followings : state.user.followings.filter((following)=>following!==action.payload)
                  }
               };

            case "coverPic" :
               return {
                  ...state,
                  user : {
                      ...state.user,
                      coverPic : action.payload
                  }
               };

               case "profilePic" :
               return {
                  ...state,
                  user : {
                      ...state.user,
                      profilePic : action.payload
                  }
               };

               case "INFOAGE" :
               return {
                  ...state,
                  user : {
                      ...state.user,
                      age : action.payload
                      
                  }
               }

               case "INFOREL" :
               return {
                  ...state,
                  user : {
                      ...state.user,
                      relationship : action.payload
                      
                  }
               }
               case "INFOWORK" :
               return {
                  ...state,
                  user : {
                      ...state.user,
                      workat : action.payload
                      
                  }
                  }
       default :
         return state;
    }
      
}

export default AuthReducer;