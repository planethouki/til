require 'ecdsa'
require 'securerandom'

group = ECDSA::Group::Secp256k1
n = group.order
privKeyA = 1 + SecureRandom.random_number(n-1)
privKeyB = 1 + SecureRandom.random_number(n-1)
privKeyC = privKeyA + privKeyB

raise 'invalid private key' if privKeyC >= n

puts 'private key: %#x' % privKeyA
puts 'private key: %#x' % privKeyB
puts 'private key: %#x' % privKeyC

pubKeyA = group.generator.multiply_by_scalar(privKeyA)
pubKeyB = group.generator.multiply_by_scalar(privKeyB)

pubKeyC1 = group.generator.multiply_by_scalar(privKeyC)

pubKeyC21 = pubKeyA.add_to_point(pubKeyB)
pubKeyC22 = pubKeyB.add_to_point(pubKeyA)



puts 'public key: %#x' % pubKeyA.x
puts 'public key: %#x' % pubKeyB.x

puts 'public key: %#x' % pubKeyC1.x
puts 'public key: %#x' % pubKeyC21.x
puts 'public key: %#x' % pubKeyC22.x

