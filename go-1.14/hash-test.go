package main

import (
	"encoding/hex"
	"fmt"
	"io"
)
import "golang.org/x/crypto/sha3"
import "golang.org/x/crypto/ripemd160"

//https://godoc.org/golang.org/x/crypto/sha3
//https://godoc.org/golang.org/x/crypto/ripemd160

func main() {
	var publicKey string = "2e834140fd66cf87b254a693a2c7862c819217b676d3943267156625e816ec6f"
	pubByte, _ := hex.DecodeString(publicKey)
	hash1 := sha3.Sum256(pubByte)
	rip := ripemd160.New()
	_, _ = io.WriteString(rip, string(hash1[:]))
	hash2 := rip.Sum(nil)
	prefix, _ := hex.DecodeString("98")
	rawAddress := make([]byte, 20)
	copy(rawAddress, hash2)
	rawAddress = append(rawAddress[:1], rawAddress[0:]...)
	rawAddress[0] = prefix[0]
	checksum := sha3.Sum256(rawAddress)
	rawAddress = append(rawAddress, checksum[:4]...)
	fmt.Println(hex.EncodeToString(rawAddress))
}
