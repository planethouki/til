require 'digest'
message ="Done is better than perfect."
#message = "example data to be hashed"
msha1 = Digest::SHA1.hexdigest(message)
msha256 = Digest::SHA256.hexdigest(message)
rsha256 = Digest::SHA256.digest(message)
msha512 = Digest::SHA512.hexdigest(message)
msha256sha256 = Digest::SHA256.hexdigest(rsha256)
mrmd160 = Digest::RMD160.hexdigest(message)
rrmd160 = Digest::RMD160.digest(message)
msha256rmd160 = Digest::RMD160.hexdigest(rsha256)

puts msha1
puts msha256
puts msha512
puts msha256sha256
puts mrmd160
puts msha256rmd160

