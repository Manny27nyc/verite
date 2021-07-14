import { v4 as uuidv4 } from "uuid"
import {
  CredentialIssuer,
  CredentialManifest,
  EntityStyle,
  OutputDescriptor,
  PresentationDefinition
} from "./types"

export function createKycAmlManifest(
  issuer: CredentialIssuer,
  styles: EntityStyle | string = {}
): CredentialManifest {
  const outputDescriptors: OutputDescriptor[] = [
    {
      id: "kycAttestationOutput",
      schema: [
        {
          uri: "http://centre.io/schemas/identity/1.0.0/KYCAMLAttestation"
        }
      ],
      name: `Proof of KYC from ${issuer.name}`,
      description: `Attestation that ${issuer.name} has completed KYC/AML verification for this subject`,
      display: {
        title: {
          path: ["$.authorityName", "$.vc.authorityName"],
          fallback: `${issuer.name} KYC Attestation`
        },
        subtitle: {
          path: ["$.approvalDate", "$.vc.approvalDate"],
          fallback: "Includes date of approval"
        },
        description: {
          text: "The KYC authority processes Know Your Customer and Anti-Money Laundering analysis, potentially employing a number of internal and external vendor providers."
        }
      },
      styles
    }
  ]

  const presentationDefinition: PresentationDefinition = {
    id: uuidv4(),
    format: {
      jwt_vp: {
        alg: ["EdDSA", "ES256K"]
      }
    },
    input_descriptors: [
      {
        id: "proofOfIdentifierControlVP",
        name: "Proof of Control Verifiable Presentation",
        purpose:
          "A Verifiable Presentation establishing proof of identifier control over the DID.",
        schema: [
          {
            uri: "/.well-known/verifiablePresentationSchema.json"
          }
        ]
      }
    ]
  }

  return {
    id: "KYCAMLAttestation",
    version: "0.1.0",
    issuer,
    format: {
      jwt_vc: {
        alg: ["EdDSA", "ES256K"]
      },
      jwt_vp: {
        alg: ["EdDSA", "ES256K"]
      }
    },
    output_descriptors: outputDescriptors,
    presentation_definition: presentationDefinition
  }
}