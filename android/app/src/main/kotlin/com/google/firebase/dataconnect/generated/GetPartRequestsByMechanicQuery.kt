
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


import kotlinx.coroutines.flow.filterNotNull as _flow_filterNotNull
import kotlinx.coroutines.flow.map as _flow_map


public interface GetPartRequestsByMechanicQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      ExampleConnector,
      GetPartRequestsByMechanicQuery.Data,
      GetPartRequestsByMechanicQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val mechanicId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val partRequests: List<PartRequestsItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class PartRequestsItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val VIN: String?,
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
    val partDescription: String,
    val urgency: String?,
    val vehicleMake: String,
    val vehicleModel: String,
    val vehicleYear: Int
  ) {
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetPartRequestsByMechanic"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetPartRequestsByMechanicQuery.ref(
  
    mechanicId: java.util.UUID,
  
  
): com.google.firebase.dataconnect.QueryRef<
    GetPartRequestsByMechanicQuery.Data,
    GetPartRequestsByMechanicQuery.Variables
  > =
  ref(
    
      GetPartRequestsByMechanicQuery.Variables(
        mechanicId=mechanicId,
  
      )
    
  )

public suspend fun GetPartRequestsByMechanicQuery.execute(
  
    mechanicId: java.util.UUID,
  
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetPartRequestsByMechanicQuery.Data,
    GetPartRequestsByMechanicQuery.Variables
  > =
  ref(
    
      mechanicId=mechanicId,
  
    
  ).execute()


  public fun GetPartRequestsByMechanicQuery.flow(
    
      mechanicId: java.util.UUID,
  
    
    ): kotlinx.coroutines.flow.Flow<GetPartRequestsByMechanicQuery.Data> =
    ref(
        
          mechanicId=mechanicId,
  
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }


// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
