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
            facingMode: "environment", 
            height: 640,
            width: 480,
            frameRate: { max: 30 }
        }
    }
    
};

export default config;