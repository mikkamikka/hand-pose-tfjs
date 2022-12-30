const fragmentShader_ = /* glsl */ `

varying vec4 vertex; 
varying vec3 Pos ; 
varying vec3 Pos2 ;
varying vec4 WorldPos ; 
varying vec3 Normal;
varying vec4 WorldNormal;
uniform vec3 CameraPos_;
uniform mat4 Matr2;
vec4 _Color = vec4(1.,1.,1.,1.);

uniform float Contrast; // 6 variables - change the shade & brightness of the diamond
uniform float PostExposure;
float _Min = 0.;
float _Max = 1.0;
float _Disaturate = 1.0;
uniform float lighttransmission;
uniform float Spec; // this changes the intensity of the external reflections

uniform vec3 _LocalSpaceCameraPos;

uniform samplerCube reflectionCube;
uniform sampler2D  _Environment2;


uniform samplerCube  _Environment;


uniform float ColorIntensity; // the intensity of the color to assign to a diamond, where 0 is just white



uniform float Dispersion; // The intensity of the refractive shift for the formation of dispersion


float DispersionR = -0.326;
float DispersionG = -0.167;
float DispersionB = 0.068;
uniform float Brightness; // Brightness diamond
uniform float Power;



float DispersionIntensity = 1.0; // dispersion intensity
uniform	sampler2D _ShapeTex;
uniform float _Scale; //           This value needs to be copied from Unity
float TotalInternalReflection = 1.0;
uniform int _SizeX; //           This value needs to be copied from Unity
uniform int _SizeY; //           This value needs to be copied from Unity
uniform float _PlaneCount; //  This value needs to be copied from Unity
const float _MaxReflection = 4.;//7.; // in a real stone, in life it is equal to 2.47, but you can change it
uniform float _RefractiveIndex; // Refractive index
uniform float _BaseReflection;

            

float random(vec2 st)
{
float r = fract(sin(dot(st.xy,
            vec2(12.9898, 78.233)))
            * 43758.5453123);
return r * clamp(pow(distance(r, 0.6), 2.5) * 100.0, 0.0, 1.0);
}

vec3 UnityWorldSpaceViewDir( in vec3 worldPos )
{
    return CameraPos_.xyz - worldPos;
}
vec3 UnityWorldSpaceViewDir2( in vec3 worldPos )
{
    return _LocalSpaceCameraPos.xyz - worldPos;
}

float CalcReflectionRate(vec3 normal, vec3 ray, float baseReflection, float borderDot)
    {
        //float normalizedDot = clamp( (abs(dot(normal,ray)) - borderDot) / ( 1.0 - borderDot ), 0.0, 1.0);

float normalizedDot = clamp((abs(dot(normal, ray)) - borderDot) / (1.0 - borderDot), 0.0, 1.0);


// return baseReflection;

        return baseReflection + (1.0-baseReflection)*pow(1.0-normalizedDot, 5.0);
    }


float rgb2hsv(vec3 c)
{
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return abs(q.z + (q.w - q.y) / (6.0 * d + e));
}

float Remap(float value, float min1, float max1, float min2, float max2)
{
    return (min2 + (value - min1) * (max2 - min2) / (max1 - min1));
}

			vec4 GetUnpackedPlaneByIndex(int index)
			{
				int x_index = int(mod(float(index) , float(_SizeX)));
                
                
				int y_index = index / _SizeX;
                
                float sX = float(_SizeX);
                float sY = float(_SizeY);

				float ustride = 1.0 / sX;
				float vstride = 1.0 / sY;

				vec2 uv = vec2((0.5+float(x_index))*ustride, (0.5+float(y_index))*vstride);

				vec4 packedPlane = texture2D(_ShapeTex, uv);



				vec3 normal = packedPlane.xyz*2.0 - vec3(1.0,1.0,1.0); // смена диапозона

				return vec4(normal, packedPlane.w*_Scale);
			}

			
float CheckCollideRayWithPlane(vec3 rayStart, vec3 rayNormalized, vec4 normalTriangle) // plane - normal.xyz и normal.w - distance
			{
    float dp = dot(rayNormalized, normalTriangle.xyz);

				if( dp < 0.0 )
				{
					return -1.0;
				}
				else
				{
        float distanceNormalized = normalTriangle.w - dot(rayStart.xyz, normalTriangle.xyz);

					if( distanceNormalized < 0.0 )
					{
						return -1.0;
					}

					return distanceNormalized / dp;
				}


				return -1.0;
			}


void CollideRayWithPlane(vec3 Pos, float PassCount, vec3 rayNormalized, vec4 TriangleNormal, float startSideRelativeRefraction, out float reflectionRate, out float reflectionRate2, out vec3 reflection, out vec3 refraction, out float HorizontalElementSquared)
			{
    vec3 rayVertical = dot(TriangleNormal.xyz, rayNormalized) * TriangleNormal.xyz;
				reflection = rayNormalized - rayVertical*2.0;
    
 
    

				vec3 rayHorizontal = rayNormalized - rayVertical;

				//vec3 refractHorizontal = rayHorizontal ;
                vec3 refractHorizontal = rayHorizontal * startSideRelativeRefraction ;

				float horizontalElementSquared = dot(refractHorizontal, refractHorizontal);
				
			/**/
    float borderDot = 0.0;

    
				if( startSideRelativeRefraction > 1.0 )
				{
					borderDot = sqrt(1.0-1.0/(startSideRelativeRefraction*startSideRelativeRefraction));
				}
				else
				{
					borderDot = 0.0;
				} 
    
    
    
                // HorizontalElementSquared = 0.0;
    HorizontalElementSquared = horizontalElementSquared;
    
    
    vec3 _worldViewDir = UnityWorldSpaceViewDir(Pos);
    _worldViewDir = normalize(_worldViewDir);
    
    
    float fresnelNdotV5 = dot(rayNormalized.xyz, _worldViewDir);

    float fresnelNode5 = (0.0 * pow(1.0 - fresnelNdotV5, 0.0));
    
    
    HorizontalElementSquared = horizontalElementSquared /3.0;
    if (horizontalElementSquared >= TotalInternalReflection)  
				{
        HorizontalElementSquared = 0.0;
        
        
					reflectionRate = 1.0;
        reflectionRate2 = 1.0;
        refraction = TriangleNormal.xyz;

					return;
				}				
			
				float verticalSizeSquared = 1.0-horizontalElementSquared;

				vec3 refractVertical = rayVertical * sqrt( verticalSizeSquared / dot(rayVertical, rayVertical));
 //   HorizontalElementSquared = verticalSizeSquared;
    
 	refraction = refractHorizontal + refractVertical;
     // refraction = rayVertical;

    
    reflectionRate = CalcReflectionRate(rayNormalized, TriangleNormal.xyz, _BaseReflection * PassCount, borderDot);

    reflectionRate2 = CalcReflectionRate(rayNormalized, TriangleNormal.xyz, _BaseReflection * PassCount, borderDot);
    

    


    
 //   reflectionRate = CalcReflectionRate(rayNormalized, TriangleNormal.xyz, _BaseReflection, 0);
   // reflectionRate = _BaseReflection;
    
				return;
			}

vec3 CalcColorCoefByDistance(float distance,vec4 Color)
			{

vec3 Pow_;

Pow_.x = pow(max(Color.x, 0.01), distance * Color.w);
Pow_.y = pow(max(Color.y, 0.01), distance * Color.w);
Pow_.z = pow(max(Color.z, 0.01), distance * Color.w);


    return Pow_;
}

			vec4 SampleEnvironment(vec3 rayLocal)
			{


            vec3 rayWorld = rayLocal;
				rayWorld = normalize(rayWorld);

    

    vec4 tex = texture2D(_Environment2, rayWorld.xy);
				return tex;
    



    
    
    
    
    
}

			void CheckCollideRayWithAllPlanes(vec3 rayStart, vec3 rayDirection, out vec4 hitPlane, out float hitTime)
			{
				hitTime=1000000.0;
				hitPlane=vec4(1,0,0,1);
		//		[unroll(20)]
    for(float i=0.; i<100000000.0; ++i)
				{
                    if(i >= _PlaneCount){
                        break;
                    }
					vec4 plane = GetUnpackedPlaneByIndex(int(i));
					float tmpTime = CheckCollideRayWithPlane(rayStart, rayDirection, plane);

					if(tmpTime >= -0.001 && tmpTime<hitTime)
					{
						hitTime = tmpTime;
						hitPlane = plane;
					}
				}
			}

vec4 GetColorByRay(vec3 rayStart, vec3 rayDirection, float refractiveIndex, int MaxReflection, vec4 Color, float lighttransmission)
			{
				vec3 tmpRayStart = rayStart;
				vec3 tmpRayDirection = rayDirection;

				float reflectionRates[10];
    float reflectionRates2[10];
				vec4 refractionColors[10];
    vec4 refractionColors2[10];
    vec4 refractionColors3[10];
				vec4 depthColors[10];

    

    
    
    const float loopCount = min(10., _MaxReflection);
    int badRay = 0;
    for( float i = 0.; i<loopCount; ++i )
				{
					float hitTime=1000000.0;
					vec4 hitPlane=vec4(1,0,0,1);
					CheckCollideRayWithAllPlanes(tmpRayStart, tmpRayDirection, hitPlane, hitTime);



                    
					if (hitTime < 0.0)
					{
						badRay = 1;
					}
										
					vec3 rayEnd = tmpRayStart + tmpRayDirection*hitTime;
								
					float reflectionRate;
        float reflectionRate2;
					vec3 reflectionRay;
					vec3 refractionRay;
        float PlaneNull;

        float i_Pass = i;
        
        if (i_Pass >= 2.0)
        {
            i_Pass = 0.0;

        }
        
        if (i_Pass < 2.0)
        {
            i_Pass = 1.0;

        }
        
        
        CollideRayWithPlane(rayStart, i_Pass, tmpRayDirection, hitPlane, refractiveIndex, reflectionRate,reflectionRate2, reflectionRay, refractionRay, PlaneNull);
		
        reflectionRates[int(i)] = reflectionRate;
        
        reflectionRates2[int(i)] = reflectionRate2;
        
        float Disp = pow(Dispersion , 2.0);
        
        float dispPow =  Dispersion * 0.4;
       
        
       
        
        

        
        float depth2 = Remap(float(i), 0.0, float(loopCount), 0.0, 1.0);
        
        
     //   depth2 = clamp(depth2, 0.0001, 1.0);
        
        depth2 = 1.0;
        
      //  PlaneNull = Remap(PlaneNull, 0, 2, 0, 1);
        
    //    PlaneNull = mix(PlaneNull,1,0);
        
        
        vec3 _worldViewDir = UnityWorldSpaceViewDir(rayStart.xyz);
        _worldViewDir = normalize(_worldViewDir);

        float fresnelNdotV5 = dot(tmpRayStart, _worldViewDir);
        float fresnelNode5 = (0.0 * pow(1.0 - fresnelNdotV5, 0.0));
        
        fresnelNode5 = 1.0;
        
        DispersionR = DispersionR * Dispersion * fresnelNode5;
        DispersionG = DispersionG * Dispersion * fresnelNode5;
        DispersionB = DispersionB * Dispersion * fresnelNode5;
        
        
        vec3 DispersionRay_r = mix(reflectionRay, mix(rayEnd, refractionRay,1.1), DispersionR * PlaneNull);
        
    //    PlaneNull = mix(PlaneNull, 1, 0.2);
        
        vec3 DispersionRay_g = mix(reflectionRay, mix(rayEnd, refractionRay, 1.1), DispersionG * PlaneNull);
        
     //   PlaneNull = mix(PlaneNull, 1, 0.2);
        vec3 DispersionRay_b = mix(reflectionRay, mix(rayEnd, refractionRay, 1.1), DispersionB * PlaneNull);
        
        
        
        
        
        
        float Depth_ = depthColors[int(i)].x;
        
        Depth_ = Remap(Depth_, 0.997, 0.999, 1.0, 0.0);
        
        
        refractionColors3[int(i)] = SampleEnvironment(refractionRay);
        
        
        
        refractionColors2[int(i)].r = SampleEnvironment(DispersionRay_r).r;
        refractionColors2[int(i)].g = SampleEnvironment(DispersionRay_g).g;
        refractionColors2[int(i)].b = SampleEnvironment(DispersionRay_b).b;
        

        Color.rgb = mix(vec3(1.0,1.0,1.0), Color.rgb, ColorIntensity).rgb;
        

                float M1 = (refractionColors3[int(i)].r + refractionColors3[int(i)].g + refractionColors3[int(i)].b);
        
        depthColors[int(i)] = vec4(CalcColorCoefByDistance(hitTime, mix(Color, vec4(1.0, 1.0, 1.0, 1.0), mix(0.0, M1 / 2.0, lighttransmission))), 1.0);

        
        refractionColors2[int(i)] = clamp(mix(refractionColors3[int(i)], refractionColors2[int(i)], DispersionIntensity),0.0,1.0);
        

        float CLR = refractionRay.x;
        
        if (CLR < 0.0)
        {
            CLR = CLR * -1.0;

        }
        
  
        
        refractionColors[int(i)] = SampleEnvironment(refractionRay);
        

        
        float DispRandom = pow(random(hitPlane.xy),0.1);
        

        
        vec3 DirDisp = clamp(tmpRayStart.rgb,-1.0,1.0);
  
        
    	

        if (i == loopCount - 1.)
        {
            reflectionRates[int(i)] = 0.0;
            reflectionRates2[int(i)] = 0.0;
        }

        tmpRayStart = tmpRayStart + tmpRayDirection * hitTime;
        tmpRayDirection = reflectionRay;
    }
				
    vec4 tmpReflectionColor = vec4(0, 0, 0, 0);
				
	
    for (float j = loopCount - 1.; j >= 0.; --j)
    {
        
         vec4 refractionColors_;
        
     
     
            tmpReflectionColor = mix(refractionColors2[int(j)], tmpReflectionColor, reflectionRates[int(j)]) * depthColors[int(j)];
        

        
        
        tmpReflectionColor = pow(tmpReflectionColor * vec4(Brightness,Brightness,Brightness,Brightness), vec4(Power,Power,Power,Power));
     
    
        
    }
				
				if (badRay > 0)
				{
					return vec4(1, 0, 0, 1);
				}
   // return vec4(Prism_.xxx, 1);
				return tmpReflectionColor;
			}


vec4 CalculateContrast(float contrastValue, vec4 colorTarget)
{
    float t = 0.5 * (1.0 - contrastValue);
    return mat4(contrastValue, 0.0, 0.0, t, 0.0, contrastValue, 0.0, t, 0.0, 0.0, contrastValue, t, 0.0, 0.0, 0.0, 1.0) * colorTarget;
}

vec4 ToneMap(vec4 MainColor, float brightness, float Disaturate, float _max, float _min, float contrast, float Satur)
{

				

				

				
    vec4 output_ = MainColor;
			//	output = output * brightness;
    output_ = output_ * brightness;
    output_ = CalculateContrast(contrast, output_);

    vec4 disatur;
    
    disatur.x = dot(output_.rgb, vec3(0.299, 0.587, 0.114)); // Desaturate
    disatur.y = dot(output_.rgb, vec3(0.299, 0.587, 0.114)); // Desaturate
    disatur.z = dot(output_.rgb, vec3(0.299, 0.587, 0.114)); // Desaturate
    
    output_ = mix(output_, disatur, clamp(pow(((output_.x + output_.y + output_.z) / 3.0) * Disaturate, 1.3), 0.0, 1.0));
    output_.x = clamp(Remap(output_.x, 0.0, 1.0, _min, mix(_max, 1.0, 0.5)), 0.0, 1.5);
    output_.y = clamp(Remap(output_.y, 0.0, 1.0, _min, mix(_max, 1.0, 0.5)), 0.0, 1.5);
    output_.z = clamp(Remap(output_.z, 0.0, 1.0, _min, mix(_max, 1.0, 0.5)), 0.0, 1.5);
				
		

				



					


    output_ = pow(output_, vec4(contrast,contrast,contrast,contrast));
				
			

    output_ = mix(clamp(output_, 0.0, _max), output_, pow(_max, 4.0));



    output_.x = mix(smoothstep(output_.x, -0.1, 0.25), output_.x, (1.0 - distance(1.0, _max) * 2.0));
    output_.y = mix(smoothstep(output_.y, -0.1, 0.25), output_.y, (1.0 - distance(1.0, _max) * 2.0));
    output_.z = mix(smoothstep(output_.z, -0.1, 0.25), output_.z, (1.0 - distance(1.0, _max) * 2.0));

				
    output_.rgb = mix(disatur.rgb, output_.rgb, Satur);

    output_ = output_ * mix(brightness, 1.0, 0.75);




    return output_;

}


void main(){
     



    vec3 cameraLocalPos;


    cameraLocalPos = (vec4(CameraPos_,1) ).xyz;

   vec3 pos = Pos;
   

 
   
   vec3 localRay = normalize(pos - cameraLocalPos) ;

   vec3 normal = Normal;
   vec4 plane = vec4(normal, dot(pos, normal));

   float reflectionRate = 0.;
   float reflectionRate2 = 0.;
   vec3 reflectionRay;
   vec3 refractionRay;
                   
   float tmpR = _RefractiveIndex;

   float  PlaneNull;



       CollideRayWithPlane(pos,0.,localRay, plane, 1.0/tmpR, reflectionRate, reflectionRate2, reflectionRay, refractionRay, PlaneNull);

    //   vec4 GetColorByRay(vec3 rayStart, vec3 rayDirection, float refractiveIndex, int MaxReflection, vec4 Color, float lighttransmission)

           vec4 refractionColor = GetColorByRay(pos, refractionRay, tmpR, 0, _Color, lighttransmission);
        refractionColor.w = 1.0;


        vec3 _worldViewDir2 = UnityWorldSpaceViewDir2(Pos.xyz);
        _worldViewDir2 = normalize(_worldViewDir2);

        vec4 WorldNormal_ = Matr2 * vec4(normalize(vec3(-Normal.x,Normal.y,Normal.z)),1.0);

        vec3 _worldReflection = reflect(-_worldViewDir2, WorldNormal_.xyz);


   //  vec4 reflectionColor = texture2D(reflectionCube, _worldReflection.xyz)  * Spec;
     vec4 reflectionColor = textureCube(reflectionCube, _worldReflection.xyz)  * Spec;
    

   float Hue = rgb2hsv(refractionColor.rgb);

    float Dis = dot(refractionColor.rgb, vec3(0.299, 0.587, 0.114));



   vec4 Fin = mix(reflectionColor,  refractionColor * (1.0 - reflectionRate), 1. - reflectionColor);

  Fin = refractionColor + reflectionColor;

  Fin = refractionColor;

   Fin = ToneMap(Fin, PostExposure, _Disaturate, _Max, _Min, Contrast, 1.);





vec4 reflectionSpec = textureCube(reflectionCube, _worldReflection.xyz);

Fin = Fin + (reflectionSpec * Spec);


//gl_FragColor = vec4(_worldViewDir2.xyz,1.);
//gl_FragColor = vec4(refractionColor);
gl_FragColor = Fin;

}
`

export default fragmentShader_
