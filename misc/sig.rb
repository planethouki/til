require 'ecdsa'
require 'securerandom'
require 'digest'
require 'openssl'

group = ECDSA::Group::Secp256k1
n = group.order
point_field = ECDSA::PrimeField.new(n)

privKey = 1 + SecureRandom.random_number(n-1)
pubKey = group.generator.multiply_by_scalar(privKey)
#puts pubKey.y.odd? ? '03' + pubKey.x.to_s(16) : '02' + pubKey.x.to_s(16)


m ="Elliptic Curve Digital Signature Algorithm Signature"
digest = Digest::SHA256.digest(m)
e = OpenSSL::BN.new(digest.unpack("H*")[0],16).to_i

k = 1 + SecureRandom.random_number(n-1)
kG = group.generator.multiply_by_scalar(k)
r = kG.x % n
raise 'r = 0' if r == 0
k_inv = point_field.inverse(k)
s = (k_inv * (e + r * privKey)) % n

p r.to_s(16)
p s.to_s(16)

p (k_inv * k) % n


sign = ECDSA.sign(group,privKey,digest,k)
p sign.r.to_s(16)
p sign.s.to_s(16)


p '==== verify sign ===='

#pubKey.infinity?
p group.generator.multiply_by_scalar(n)

w = point_field.inverse(s) % n
u1 = (e * w) % n
u2 = (r * w) % n
u1G = group.generator.multiply_by_scalar(u1)
u2Q = pubKey.multiply_by_scalar(u2)
x1y1 = u1G.add_to_point(u2Q)

p x1y1.x.to_s(16)

