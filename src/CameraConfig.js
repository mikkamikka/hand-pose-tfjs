const config = {
    pc: {
        audio: false,
        video: {
            // facingMode by default made for mobile, when running on PC the facingMode automatically change to "user"
            facingMode: "environment", 
            width: 640,
            height: 480,
            frameRate: { max: 30 }
        }
    },
    mobile: {
        audio: false,
        video: {
            // facingMode by default made for mobile, when running on PC the facingMode automatically change to "user"
            facingMode: "user", 
            width: 360,
            height: 270            
            // frameRate: { max: 30 }
        }
    }
    
};

export default config;