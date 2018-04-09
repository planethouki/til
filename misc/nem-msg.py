import ed25519
import hashlib
import sha3
import binascii
import base64
from Crypto.Cipher import AES

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
'''
pubKey1 = calc_pubkey(privKey1)
pubKey2 = calc_pubkey(privKey2)
pubKey3 = calc_pubkey(privKey3)
pubKey4 = calc_pubkey(privKey4)
address1 = calc_address(pubKey1)
address2 = calc_address(pubKey2)
address3 = calc_address(pubKey3)
address4 = calc_address(pubKey4)
'''
pubKey1 = 0xc2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3
pubKey2 = 0xbe345b8f6c33523595078ab25c94f70c860e68286223b06cc423c4297fffd30b
pubKey3 = 0x54ebcd521e3117e742aac03c71abe97038b78e0ac98438a8845996c76227d327
pubKey4 = 0x125a9ef2a10eb835771ceea37b5faae6b9132a3e5b8b7e6549b5ba77f2b95cf2

def calc_share_g(privKey, pubKey):
    privKey_bin = binascii.unhexlify(format(privKey,'064x'))
    h_bin = sha3.keccak_512(privKey_bin[::-1]).digest()
    h_binstrlit = bin(int(binascii.hexlify(h_bin[::-1]),16))
    a = calc_a(h_binstrlit)

    pubKey_ = ed25519.decodepoint(binascii.unhexlify(format(pubKey,'x')))
    shareG = ed25519.scalarmult(pubKey_,a)

    shareG_enc = binascii.hexlify(ed25519.encodepoint(shareG))
    print('encode shareG = %s' % shareG_enc)
    return int(shareG_enc,16)

share_g_32 = calc_share_g(privKey3, pubKey2)
#share_g_23 = calc_share_g(privKey2, pubKey3)

iv = 0xab3b10440e0b008a322585dcf56dab14
#iv = 0x14AB6DF5DC8525328A000B0E44103BAB
#salt = 0x00b5dc0dd73f27733e4193a2f357401aae8b144d5bceed63e2baacb244bffa8c
salt = 0x8CFABF44B2ACBAE263EDCE5B4D148BAE1A4057F3A293413E73273FD70DDCB500
message = 'encrypted messasge              '

shareKey = sha3.keccak_256(binascii.unhexlify(format(share_g_32,'x')) + binascii.unhexlify(format(salt,'x')))


aes = AES.new(shareKey.digest(), AES.MODE_CBC, binascii.unhexlify(format(iv,'x')))
encrypt_data = aes.encrypt(message)
print(encrypt_data.encode('hex'))

'''
privKey = 0962c6505d02123c40e858ff8ef21e2b7b5466be12c4770e3bf557aae828390f
encode pubKey = c2e19751291d01140e62ece9ee3923120766c6302e1099b04014fe1009bc89d3
privKey = 88f5985092a89fb2f02e13a153ad35ef46e4dd8498696bd50f8d950b947087d0
encode pubKey = be345b8f6c33523595078ab25c94f70c860e68286223b06cc423c4297fffd30b
privKey = f55166ba0e4aa2a529a74ad523014e6684c9077aae1852af80f48dc821026116
encode pubKey = 54ebcd521e3117e742aac03c71abe97038b78e0ac98438a8845996c76227d327
privKey = 0af3c669fc25b6431a3024dc38a8b7338856441f5ac27c1aa0a857d9f893e91a
encode pubKey = 125a9ef2a10eb835771ceea37b5faae6b9132a3e5b8b7e6549b5ba77f2b95cf2
TCKMNCU3STBWBR7E3XD2LR7WSIXF5IVJIDBHBZQT
TA2VKRQKUJDOBIAEX2METU4UBZ6MCSERPJE3UEOT
TCGZEADSFI2GNW3PSERH2ZL7HZBGBUPNJYMMK4ZH
TDRQXRFJCCZFFV4PG5HGRYONW5NK6JT6BU77O2R3
'''

'''
Transfer transaction
Block: 1412842
Hash: 7943647b153624b5e35761bcb09ac6fbb25194d786bbd6bf20fec364ce317f61
Sender: tcgzea-dsfi2g-nw3pse-rh2zl7-hzbgbu-pnjymm-k4zh
Recipient: ta2vkr-qkujdo-biaex2-metu4u-bz6mcs-erpje3-ueot
Amount: 5.000000
Fee: 0.200000
Timestamp: 2018-04-09 05:09:51 Deadline: 2018-04-09 06:09:51
Signature: 073dcfab00c59772fcc7db6f1146558955a579273ed5e15ad83517f4afb86d2cf500610eff881577c2cc21c92584054a483b09151fb96e112b268bcc5bc1b40a
Message: 00b5dc0dd73f27733e4193a2f357401aae8b144d5bceed63e2baacb244bffa8cab3b10440e0b008a322585dcf56dab1469a7566185636d25e69c824a9b1d1bffebee03ade8717ebb54bafded74ce1b17
'''

'''
salt:    00b5dc0dd73f27733e4193a2f357401aae8b144d5bceed63e2baacb244bffa8c
iv:      ab3b10440e0b008a322585dcf56dab14
payload: 69a7566185636d25e69c824a9b1d1bffebee03ade8717ebb54bafded74ce1b17
'''
