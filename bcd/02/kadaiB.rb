require 'ecdsa'
require 'securerandom'

group = ECDSA::Group::Secp256k1

n = group.order
#privKey = 1 + SecureRandom.random_number(n-1)
privKey = 84370321610215031974582375851313642477610672803952108851805126719289457842410
puts privKey
pubKey = group.generator.multiply_by_scalar(privKey)
puts pubKey.x
puts pubKey.y

require 'digest'
message ="Done is better than perfect."
digest = Digest::SHA256.hexdigest(message)
puts message
puts digest

k = 1 + SecureRandom.random_number(n-1)
sign = ECDSA.sign(group,privKey,digest,k)

der_sign = ECDSA::Format::SignatureDerString.encode(sign)
puts der_sign
puts der_sign.unpack("H*")

puts ECDSA.valid_signature?(pubKey,digest,sign)
