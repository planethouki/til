import ed25519
import hashlib
import sha3
import binascii
import base64

def calc_a(h_binstrlit):
    a_right = 0
    for i in range(3,253+1):
        a_right += 2**i * int(h_binstrlit[-i-1])

    return 2**254 + a_right

def calc_pubkey(privKey):
    privKey_bin = binascii.unhexlify(format(privKey,'064x'))
    h_bin = sha3.keccak_512(privKey_bin[::-1]).digest()
    h_binstrlit = bin(int(binascii.hexlify(h_bin[::-1]),16))
    print('privKey = %064x' % privKey)
    #print('sha3 privKey = 0x%s' % binascii.hexlify(h_bin))

    a = calc_a(h_binstrlit)
    #print('a = %d' % a)

    pubKey = ed25519.scalarmult(ed25519.B,a)
    pubKey_enc = binascii.hexlify(ed25519.encodepoint(pubKey))
    print('encode pubKey = %s' % pubKey_enc)
    return int(pubKey_enc,16)

def calc_address(pubKey):
    #print('pubKey: %x' % pubKey)
    sha3PubKey = sha3.keccak_256(binascii.unhexlify(format(pubKey,'064x')))
    #print(sha3PubKey.hexdigest())
    ripemd160PubKey = hashlib.new('ripemd160')
    ripemd160PubKey.update(sha3PubKey.digest())
    #print(ripemd160PubKey.hexdigest())
    versionPubKey = '98' + ripemd160PubKey.hexdigest()
    #print(versionPubKey)
    sha3check = sha3.keccak_256(binascii.unhexlify(versionPubKey)).hexdigest()
    #print(sha3check)
    address_raw = versionPubKey + sha3check[0:8]
    address_str = base64.b32encode(binascii.unhexlify(address_raw))
    #print(address_raw)
    print(address_str)
    return address_str

privKey1 = 0x0962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f
privKey2 = 0x0088f5985092a89fb2f02e13a153ad35ef46e4dd8498696bd50f8d950b947087d0
privKey3 = 0x00f55166ba0e4aa2a529a74ad523014e6684c9077aae1852af80f48dc821026116
privKey4 = 0x0af3c669fc25b6431a3024dc38a8b7338856441f5ac27c1aa0a857d9f893e91a
pubKey1 = calc_pubkey(privKey1)
pubKey2 = calc_pubkey(privKey2)
pubKey3 = calc_pubkey(privKey3)
pubKey4 = calc_pubkey(privKey4)
address1 = calc_address(pubKey1)
address2 = calc_address(pubKey2)
address3 = calc_address(pubKey3)
address4 = calc_address(pubKey4)
