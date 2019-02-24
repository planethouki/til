require 'yaml'
p "HelloWorld"
arg0 = ARGV[0]
print arg0
keys = YAML.load(File.open("hoge.yaml").read)
p keys
require_relative('hoge')
p Hoge::HOGE
p Hoge::fuga
p Hoge.fuga
# p Hoge.piyo   // instance method