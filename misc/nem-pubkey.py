import ed25519
import hashlib
import sha3
import binascii

#print('basepoint Bx = 0x%x' % ed25519.B[0])
#print('basepoint By = 0x%x' % ed25519.B[1])

# must be
# "privateKey": "0962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f"
# "address": "NCKMNCU3STBWBR7E3XD2LR7WSIXF5IVJIDBHBZQT"
# "publicKey": "c2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3"

# must be
# public key
# X: deb73ed7d0334e983701feba4599a37fb62e862e45368525b8d9fb9ab80aa57e
# Y: 169318abc3e5b002059a396d4cf1c3d35ba022c675b15fb1c4943f7662eef268
# Z: a90573bd221a3ae33fec5d4efc4fa137897a40347eeafe87bee5d67ae5b4f725
# compressed public key
# c5247738c3a510fb6c11413331d8a47764f6e78ffcdb02b6878d5dd3b77f38ed

privKey = 0x0962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f
privKey_bin = binascii.unhexlify(format(privKey,'064x'))
#pubKey_bin = ed25519.publickey(privKey_bin)
#pubKey = ed25519.decodepoint(pubKey_bin)
print('privKey: %#064x' % privKey)
#print('pubKey.x: %#064x' % pubKey[0])
#print('pubKey.y: %#064x' % pubKey[1])
#print((pubKey[0] & 1) << 255)

#h_hexstr = hashlib.sha3_512(privKey_bin).hexdigest()
h_bin = sha3.keccak_512(privKey_bin[::-1]).digest()
h_binstrlit = bin(int(binascii.hexlify(h_bin[::-1]),16))
print('sha3 privKey = 0x%s' % binascii.hexlify(h_bin))

a_right = 0
for i in range(3,253+1):
    a_right += 2**i * int(h_binstrlit[-i-1])

a = 2**254 + a_right
print(a)

# a = 41422686960260717344296788141818288197588019943554557380043421796149900949192

pubKey = ed25519.scalarmult(ed25519.B,a)
print('pubKey Ax = 0x%x' % pubKey[0])
print('pubKey Ay = 0x%x' % pubKey[1])
print('isoncurve: %s' % ed25519.isoncurve(pubKey))
#print('pubKey Ax = %d' % pubKey[0])
#print('pubKey Ay = %d' % pubKey[1])
print('encode pubKey = %s' % binascii.hexlify(ed25519.encodepoint(pubKey)))


'''
privKey: 0x962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f
sha3 privKey = 0xce36c5c2f558904e89755a989e92f9f49841ca705c8a6b14ee818e82f468945b97a548ca1706f74996e8f9e3f5a08df5fd86d346169b802b3ea01e47cb1a4a00
41422686960260717344296788141818288197588019943554557380043421796149900949192
pubKey Ax = 0x350130da69b31a12f2f8fee25be55b61e58e9cc5c99dc28e426b8d878452081
pubKey Ay = 0x5389bc0910fe1440b099102e30c66607122339eee9ec620e14011d295197e1c2
isoncurve: True
encode pubKey = c2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3
'''
