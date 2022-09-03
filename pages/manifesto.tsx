import { useEffect, useState } from "react"
import { useAccount, useDisconnect, useEnsName } from "wagmi"
import ReactMarkdown from "react-markdown"
import { getManifesto } from "../libs/arweave"
import { Box, Flex, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { ModalWrapper, PageHero, Section, IconButton } from "../components"

const Manifesto = () => {
  const [manifesto, setManifesto] = useState({})
  const signManifestoForm = useDisclosure()
  const toast = useToast()
  const { address, isConnecting } = useAccount()
  console.log("address", address)

  useEffect(() => {
    const fetchManifesto = async () => {
      const manifestoResponse = await getManifesto(
        `${process.env.NEXT_PUBLIC_ARWEAVE_TX_ID}`
      )

      setManifesto(manifestoResponse.data["manifesto"])
    }
    fetchManifesto()
  }, [])

  async function signManifestoHandler() {
    console.log("address", address)
    // setSending(false)

    const res = await fetch("/api/arweave/sign_transaction", {
      method: "POST",
      body: JSON.stringify({
        name: "jp-dev",
        address: address,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })

    const signatureResponse = await res.json()
    if (signatureResponse) {
      toast({
        title: "Signature Recorded",
        description: "Your signature has been recorded",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      signManifestoForm.onClose()
    }
  }

  return (
    <>
      <Flex>
        {/* <PageHero bg="brand.red">Manifesto</PageHero> */}
        <Section py={75}>
          {manifesto ? (
            <Flex
              mx={{ base: 6, xl: 0 }}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ReactMarkdown children={manifesto.toString()} />
              <Flex
                display="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  color="brand.teal"
                  marginY={4}
                >
                  Read and sign our Community First Manifesto to get started.
                </Text>
                <IconButton
                  color="brand.red"
                  icon="scroll"
                  title="Sign Manifesto"
                  onClick={signManifestoForm.onOpen}
                />
              </Flex>
            </Flex>
          ) : (
            <Flex>Loading...</Flex>
          )}
        </Section>
      </Flex>
      <ModalWrapper
        isOpen={signManifestoForm.isOpen}
        onClose={signManifestoForm.onClose}
        title="Sign the Manifesto"
        content={
          <IconButton
            color="brand.red"
            icon="scroll"
            title="Sign Manifesto"
            onClick={signManifestoHandler}
          />
        }
      />
    </>
  )
}

export default Manifesto
