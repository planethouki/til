import hashlib
import binascii
import sha3
import base64

# must be
# "privateKey": "0962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f"
# "address": "NCKMNCU3STBWBR7E3XD2LR7WSIXF5IVJIDBHBZQT"
# "publicKey": "c2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3"

# must be
# publicKey: c5247738c3a510fb6c11413331d8a47764f6e78ffcdb02b6878d5dd3b77f38ed
# sha3-256: 70c9dcf696b2ad92dbb9b52ceb33ec0eda5bfdb7052df4914c0919caddb9dfcf
# ripemd160: 1f142c5ea4853063ed6dc3c13aaa8257cd7daf11
# version: 681f142c5ea4853063ed6dc3c13aaa8257cd7daf11
# sha3: 09132a5e a90ab7fa077847a699b4199691b4130f66876254eadd70ae459dbb53
# base32: NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6

pubKey = 0xc5247738c3a510fb6c11413331d8a47764f6e78ffcdb02b6878d5dd3b77f38ed
#pubKey = 0xc2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3
print('pubKey: %x' % pubKey)
sha3PubKey = sha3.keccak_256(binascii.unhexlify(format(pubKey,'064x')))
print(sha3PubKey.hexdigest())
ripemd160PubKey = hashlib.new('ripemd160')
ripemd160PubKey.update(sha3PubKey.digest())
print(ripemd160PubKey.hexdigest())
versionPubKey = '68' + ripemd160PubKey.hexdigest()
print(versionPubKey)
sha3check = sha3.keccak_256(binascii.unhexlify(versionPubKey)).hexdigest()
print(sha3check)
address_raw = versionPubKey + sha3check[0:8]
print(address_raw)
print(base64.b32encode(binascii.unhexlify(address_raw)))

# where c270e613
print(sha3.keccak_512(binascii.unhexlify(versionPubKey)).hexdigest())

#print(hashlib.algorithms_available)


#print(hashlib.sha3_256('aiueo').hexdigest()) #d10a92c5bc42f96f507650eb0a4bc38a0b852261d010751f51311df065b84146
#print(python_sha3.sha3_256('aiueo').hexdigest()) #9eefc5342509c06a2ab018bb335db73e2e2ff0cb2d470fa0c67d040c4e36c839


'''
pubKey: c2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3
db4918869715dd2eb24ec565000b65eeaa4debef99d4af87392c45b787335055
94c68a9b94c360c7e4ddc7a5c7f6922e5ea2a940
6894c68a9b94c360c7e4ddc7a5c7f6922e5ea2a940
04eabfc1d01121bfb0dc470d44002b94e273d7b018c26686c052738494db7d41
6894c68a9b94c360c7e4ddc7a5c7f6922e5ea2a94004eabfc1
NCKMNCU3STBWBR7E3XD2LR7WSIXF5IVJIACOVP6B
c250245eb2ce9a2a65062cbb84b4052e0df98c3c549fde0c4befb4b5a81a9a3ee244982125c7af4e1d1615f598f127b4e0452a8c2c557ce613c734c4cb168260

pubKey: c5247738c3a510fb6c11413331d8a47764f6e78ffcdb02b6878d5dd3b77f38ed
70c9dcf696b2ad92dbb9b52ceb33ec0eda5bfdb7052df4914c0919caddb9dfcf
1f142c5ea4853063ed6dc3c13aaa8257cd7daf11
681f142c5ea4853063ed6dc3c13aaa8257cd7daf11
09132a5ea90ab7fa077847a699b4199691b4130f66876254eadd70ae459dbb53
681f142c5ea4853063ed6dc3c13aaa8257cd7daf1109132a5e
NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6
ec751ea654a5f91bbc8fb9ce32c3090f855baedd1675584229ca5bfaa402c85d30da58a4a3d117e30447bf61e394e01b9dd9274a1f3edd216f7c305784583b1f
'''
