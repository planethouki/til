contract Addition{
  int num = 0;
  function add(int a) {
    num += a;
  }
  function get() returns(int){
    return num;
  }
}
