puts '================================='
require 'digest'
message ="Done is better than perfect."
#message = "example data to be hashed"
messageHex = message.unpack("H*")[0]

prefix = '00'

payload = Digest::RMD160.hexdigest(Digest::SHA256.digest(message))
puts payload

prefixPayload = [prefix + payload].pack("H*")

prefixPayloadDoubleHash = Digest::SHA256.hexdigest(Digest::SHA256.digest(prefixPayload))

checksum = prefixPayloadDoubleHash[0...8]
puts checksum

puts '------------------------'

require 'bitcoin'

base58check = Bitcoin::encode_base58(prefix + payload + checksum)
puts base58check

puts Bitcoin.base58_checksum?(base58check)
puts Bitcoin::decode_base58(base58check)

Bitcoin::network = :bitcoin
address = Bitcoin::pubkey_to_address(messageHex)
puts address
puts Bitcoin.base58_checksum?(address)
puts Bitcoin::decode_base58(address)


puts '================================='
