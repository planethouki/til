using System;

namespace World
{
    [Serializable]
    public class Region
    {
        public Plane[] data;
    }

    [Serializable]
    public class Plane
    {
        public int x;
        public int z;
        public bool[] vertical;
    }
}
