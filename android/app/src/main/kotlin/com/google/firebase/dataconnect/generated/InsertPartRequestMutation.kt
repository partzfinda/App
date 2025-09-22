
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated



public interface InsertPartRequestMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      InsertPartRequestMutation.Data,
      InsertPartRequestMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val mechanicId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val VIN: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val partDescription: String,
    val urgency: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val vehicleMake: String,
    val vehicleModel: String,
    val vehicleYear: Int
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      @BuilderDsl
      public interface Builder {
        public var mechanicId: java.util.UUID
        public var VIN: String?
        public var partDescription: String
        public var urgency: String?
        public var vehicleMake: String
        public var vehicleModel: String
        public var vehicleYear: Int
        
      }

      public companion object {
        @Suppress("NAME_SHADOWING")
        public fun build(
          mechanicId: java.util.UUID,partDescription: String,vehicleMake: String,vehicleModel: String,vehicleYear: Int,
          block_: Builder.() -> Unit
        ): Variables {
          var mechanicId= mechanicId
            var VIN: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var partDescription= partDescription
            var urgency: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var vehicleMake= vehicleMake
            var vehicleModel= vehicleModel
            var vehicleYear= vehicleYear
            

          return object : Builder {
            override var mechanicId: java.util.UUID
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { mechanicId = value_ }
              
            override var VIN: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { VIN = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var partDescription: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { partDescription = value_ }
              
            override var urgency: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { urgency = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var vehicleMake: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { vehicleMake = value_ }
              
            override var vehicleModel: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { vehicleModel = value_ }
              
            override var vehicleYear: Int
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { vehicleYear = value_ }
              
            
          }.apply(block_)
          .let {
            Variables(
              mechanicId=mechanicId,VIN=VIN,partDescription=partDescription,urgency=urgency,vehicleMake=vehicleMake,vehicleModel=vehicleModel,vehicleYear=vehicleYear,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("partRequest_insert") val key: PartRequestKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "InsertPartRequest"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun InsertPartRequestMutation.ref(
  
    mechanicId: java.util.UUID,partDescription: String,vehicleMake: String,vehicleModel: String,vehicleYear: Int,
  
    block_: InsertPartRequestMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    InsertPartRequestMutation.Data,
    InsertPartRequestMutation.Variables
  > =
  ref(
    
      InsertPartRequestMutation.Variables.build(
        mechanicId=mechanicId,partDescription=partDescription,vehicleMake=vehicleMake,vehicleModel=vehicleModel,vehicleYear=vehicleYear,
  
    block_
      )
    
  )

public suspend fun InsertPartRequestMutation.execute(
  
    mechanicId: java.util.UUID,partDescription: String,vehicleMake: String,vehicleModel: String,vehicleYear: Int,
  
    block_: InsertPartRequestMutation.Variables.Builder.() -> Unit = {}
  
  ): com.google.firebase.dataconnect.MutationResult<
    InsertPartRequestMutation.Data,
    InsertPartRequestMutation.Variables
  > =
  ref(
    
      mechanicId=mechanicId,partDescription=partDescription,vehicleMake=vehicleMake,vehicleModel=vehicleModel,vehicleYear=vehicleYear,
  
    block_
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
