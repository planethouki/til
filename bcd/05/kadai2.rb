require 'securerandom'
require 'bitcoin'
require 'digest'
require 'openssl'
require 'ecdsa'

# https://github.com/lian/bitcoin-ruby/blob/master/lib/bitcoin/trezor/mnemonic.rb

root_ent_r = SecureRandom.hex(16)
root_ent_f = "e938ff837eee2661bbf3e8dc7e999722"
root_ent_t = "f76c442bf7847df1a6c1a859043eb02e"
root_ent_use = root_ent_t
mnemonic = Bitcoin::Trezor::Mnemonic.to_mnemonic([root_ent_use].pack("H*"))
seed = Bitcoin::Trezor::Mnemonic.to_seed(mnemonic)
#seed to be c134ba00badd038b9f7bc8506c5a6245c0762e1d2fb65e73606f353298c3014b1c748baa9b9e6d0cedcf6d11fa192cf707d6e85370180d5d95274ba09e72e279

i_master = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('SHA512'),"Bitcoin seed",[seed].pack("H*"))

v = "0488ade4"
d = "00"
f = "00000000"
i = "00000000"
c_master = i_master[64..127]
p_pre = "00"
p_master = i_master[0..63]
payload = v + d + f + i + c_master + p_pre + p_master
check_sum = Digest::SHA256.hexdigest(Digest::SHA256.digest([payload].pack("H*")))

p_master_ser = Bitcoin.encode_base58(payload + check_sum[0..7])
p p_master_ser
#p_master_ser to be xprv9s21ZrQH143K4GKGLy7cuGD7dqsXC8Sy82FQkeABdzaZ7otVpbrMZyK6CmSjZcRiaYRnNrGa9GxRUqz6mzasQiq3QmdHwNcqgsFbBoNba7G

# m/44'/0'/0'/0/0 address
#CURVE_ORDER = 115792089237316195423570985008687907852837564279074904382605163141518161494337
group = ECDSA::Group::Secp256k1
CURVE_ORDER = group.order

payload_m_44h = "00" + i_master[0..63] + "8000002c"
key_m_44h = i_master[64..127]
i_m_44h = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('SHA512'),[key_m_44h].pack("H*"),[payload_m_44h].pack("H*"))
priv_m_44h = ((OpenSSL::BN.new(i_m_44h[0..63],16) + OpenSSL::BN.new(i_master[0..63],16)) % CURVE_ORDER).to_hex
#ecpub_m_44h = group.generator.multiply_by_scalar(OpenSSL::BN.new(priv_m_44h,16).to_i)
#pub_m_44h = ecpub_m_44h.y.odd? ? '03' + ecpub_m_44h.x.to_s(16) : '02' + ecpub_m_44h.x.to_s(16)
#p priv_m_44h
#p pub_m_44h

payload_m_44h_0h = "00" + priv_m_44h + "80000000"
key_m_44h_0h = i_m_44h[64..127]
i_m_44h_0h = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('SHA512'),[key_m_44h_0h].pack("H*"),[payload_m_44h_0h].pack("H*"))
priv_m_44h_0h = ((OpenSSL::BN.new(i_m_44h_0h[0..63],16) + OpenSSL::BN.new(priv_m_44h,16)) % CURVE_ORDER).to_hex
#p i_m_44h_0h[64..127]
p priv_m_44h_0h




# class way
p "======== class way ==========="
class ExtKey
  attr_accessor :chain_code
  attr_accessor :priv_key
  CURVE_ORDER = 115792089237316195423570985008687907852837564279074904382605163141518161494337

  def derive(number)
    new_key = ExtKey.new
    if number > (2**31 - 1)
      data = [0x00].pack("C") << [priv_key].pack("H*") << [number].pack("N")
    else
      group = ECDSA::Group::Secp256k1
      ecpub = group.generator.multiply_by_scalar(OpenSSL::BN.new(priv_key,16).to_i)
      pub = ecpub.y.odd? ? '03' + ecpub.x.to_s(16) : '02' + ecpub.x.to_s(16)
      data = [pub].pack("H*") << [number].pack("N")
    end
    l = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('SHA512'),[chain_code].pack("H*"),data)
    new_key.priv_key = ((OpenSSL::BN.new(l[0..63],16) + OpenSSL::BN.new(priv_key,16)) % CURVE_ORDER).to_hex
    new_key.chain_code = l[64..127]
    new_key
  end
end

# m/44'/0'/0'/0/0 address
key0 = ExtKey.new
key0.priv_key = p_master
key0.chain_code = c_master
priv5 = key0.derive(2**31+44).derive(2**31).derive(2**31).derive(0).derive(0).priv_key
ecpub5 = group.generator.multiply_by_scalar(OpenSSL::BN.new(priv5,16).to_i)
pub5 = ecpub5.y.odd? ? '03' + ecpub5.x.to_s(16) : '02' + ecpub5.x.to_s(16)
p Bitcoin.pubkey_to_address(pub5)

#p key0.derive(2**31+44).derive(2**31).priv_key
#p key0.derive(2**31+44).derive(2**31).derive(2**31).priv_key
#p key0.derive(2**31+44).derive(2**31).derive(2**31).derive(0).derive(0).priv_key


# easy way
p "======== easy way ==========="
p_master_ = Bitcoin::ExtKey.generate_master([seed].pack("H*"))
pubkey_ = p_master_.derive(2**31 + 44).derive(2**31).derive(2**31).derive(0).derive(0).pub
bip44addr_ = Bitcoin.pubkey_to_address(pubkey_)
p bip44addr_
#p p_master_.derive(2**31 + 44).derive(2**31).priv
#p p_master_.derive(2**31 + 44).derive(2**31).chain_code.unpack("H*")
#p p_master_.derive(2**31 + 44).derive(2**31).derive(2**31).priv
#p p_master_.derive(2**31 + 44).derive(2**31).derive(2**31).derive(0).derive(0).priv



