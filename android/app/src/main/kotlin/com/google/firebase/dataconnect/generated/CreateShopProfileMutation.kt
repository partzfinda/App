
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



public interface CreateShopProfileMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      CreateShopProfileMutation.Data,
      CreateShopProfileMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val userId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val deliveryOptions: com.google.firebase.dataconnect.OptionalVariable<List<String>?>,
    val inventorySpecialties: com.google.firebase.dataconnect.OptionalVariable<List<String>?>,
    val primaryContactPerson: String,
    val shopName: String
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      @BuilderDsl
      public interface Builder {
        public var userId: java.util.UUID
        public var deliveryOptions: List<String>?
        public var inventorySpecialties: List<String>?
        public var primaryContactPerson: String
        public var shopName: String
        
      }

      public companion object {
        @Suppress("NAME_SHADOWING")
        public fun build(
          userId: java.util.UUID,primaryContactPerson: String,shopName: String,
          block_: Builder.() -> Unit
        ): Variables {
          var userId= userId
            var deliveryOptions: com.google.firebase.dataconnect.OptionalVariable<List<String>?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var inventorySpecialties: com.google.firebase.dataconnect.OptionalVariable<List<String>?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var primaryContactPerson= primaryContactPerson
            var shopName= shopName
            

          return object : Builder {
            override var userId: java.util.UUID
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { userId = value_ }
              
            override var deliveryOptions: List<String>?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { deliveryOptions = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var inventorySpecialties: List<String>?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { inventorySpecialties = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var primaryContactPerson: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { primaryContactPerson = value_ }
              
            override var shopName: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { shopName = value_ }
              
            
          }.apply(block_)
          .let {
            Variables(
              userId=userId,deliveryOptions=deliveryOptions,inventorySpecialties=inventorySpecialties,primaryContactPerson=primaryContactPerson,shopName=shopName,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("shopProfile_insert") val key: ShopProfileKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateShopProfile"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateShopProfileMutation.ref(
  
    userId: java.util.UUID,primaryContactPerson: String,shopName: String,
  
    block_: CreateShopProfileMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    CreateShopProfileMutation.Data,
    CreateShopProfileMutation.Variables
  > =
  ref(
    
      CreateShopProfileMutation.Variables.build(
        userId=userId,primaryContactPerson=primaryContactPerson,shopName=shopName,
  
    block_
      )
    
  )

public suspend fun CreateShopProfileMutation.execute(
  
    userId: java.util.UUID,primaryContactPerson: String,shopName: String,
  
    block_: CreateShopProfileMutation.Variables.Builder.() -> Unit = {}
  
  ): com.google.firebase.dataconnect.MutationResult<
    CreateShopProfileMutation.Data,
    CreateShopProfileMutation.Variables
  > =
  ref(
    
      userId=userId,primaryContactPerson=primaryContactPerson,shopName=shopName,
  
    block_
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
