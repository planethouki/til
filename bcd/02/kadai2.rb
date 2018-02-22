puts '================================='
require 'digest'
message ="Done is better than perfect."
#message = "example data"

payload = message.unpack("H*")[0]
puts payload

payloadDoubleHash = Digest::SHA256.hexdigest(Digest::SHA256.digest(message))

checksum = payloadDoubleHash[0...8]
puts checksum

puts '------------------------'

require 'bitcoin'

base58check = Bitcoin::encode_base58(payload + checksum)
puts base58check

puts Bitcoin.base58_checksum?(base58check)
puts Bitcoin::decode_base58(base58check)


puts '================================='
