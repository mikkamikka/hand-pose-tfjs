const vertexShader_ = /* glsl */ `


varying vec3 Pos ; 
varying vec4 WorldPos ; 

varying vec3 Normal;

varying vec4 WorldNormal;

void main (){



    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);



    Normal = normal;

    //WorldNormal = modelMatrix * vec4(normalize(normal),1.0); 

    WorldNormal = modelMatrix * vec4(normalize(normal),1.0); 

      Pos = position;
      WorldPos = modelMatrix * vec4(position,1.0);

}
`;
export default vertexShader_;