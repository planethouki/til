package main

import "fmt"
import "encoding/hex"
import "crypto/ed25519"

//https://golang.org/pkg/crypto/ed25519/

func main() {
	seed3, _ := hex.DecodeString("575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced")
	priv3 := ed25519.NewKeyFromSeed(seed3)
	var pub3 interface{} = priv3.Public()
	var pub3a ed25519.PublicKey = pub3.(ed25519.PublicKey)
	fmt.Println(hex.EncodeToString(pub3a))
}
