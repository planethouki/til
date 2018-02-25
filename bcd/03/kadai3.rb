require 'digest'

def doublehash(data)
  Digest::SHA256.hexdigest(Digest::SHA256.digest(data))
end

message = "Blockchain Daigakko"

for num in 1..100 do
  noncemessage = message + num.to_s
  noncehash = doublehash(noncemessage)
  # puts noncemessage + ": " + noncehash
  if noncehash[0,2] == "00" then
    puts noncemessage + ": " + noncehash
  end
end

