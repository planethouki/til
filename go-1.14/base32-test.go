package main

import (
	"encoding/base32"
	"encoding/hex"
	"fmt"
)

func main() {
	//address := "98A1276D7425939BF11376398B557D981C44F7D8BD192024E7"
	address := "9826d27e1d0a26ca4e316f901e23e55c8711db20dfd2677696"
	addressByte, _ := hex.DecodeString(address)
	encode := base32.StdEncoding.EncodeToString(addressByte)
	fmt.Println(encode)
}
