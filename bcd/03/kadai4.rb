require 'digest'

def dhash(data)
  Digest::SHA256.digest(Digest::SHA256.digest( [data].pack("H*").reverse )).reverse.unpack("H*")[0]
end

def merkle_root(nodes)
  if nodes.size==1 then nodes[0]
  else
    merkle_root(nodes.each_slice(2).map{|x|
    if x.size==2 then dhash(x[1]+x[0])
    else dhash(x[0]+x[0])
    end})
  end
end

TXID_LIST = [
  "de2c2e8628ab837ceff3de0217083d9d5feb71f758a5d083ada0b33a36e1b30e",
  "89878bfd69fba52876e5217faec126fc6a20b1845865d4038c12f03200793f48"
]

mRoot = merkle_root(TXID_LIST)

puts mRoot

puts dhash("89878bfd69fba52876e5217faec126fc6a20b1845865d4038c12f03200793f48de2c2e8628ab837ceff3de0217083d9d5feb71f758a5d083ada0b33a36e1b30e")


TX1_LE = "0EB3E1363AB3A0AD83D0A558F771EB5F9D3D081702DEF3EF7C83AB28862E2CDE"
TX2_LE = "483F790032F0128C03D4655884B1206AFC26C1AE7F21E57628A5FB69FD8B8789"
puts Digest::SHA256.hexdigest(Digest::SHA256.digest([TX1_LE + TX2_LE].pack("H*")))
