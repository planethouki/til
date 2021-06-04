using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using World;

public class NewBehaviourScript : MonoBehaviour
{
    private void Start()
    {        
        var inputString = Resources.Load<TextAsset>("out").ToString();
        var region = JsonUtility.FromJson<Region>(inputString);
        foreach (var plane in region.data)
        {
            var x = plane.x;
            var z = plane.z;
            for (int i = 0; i < plane.vertical.Length; i++)
            {
                var y = i;
                var value = plane.vertical[i];
                if (value)
                {
                    Debug.Log(value);
                    var cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    cube.transform.position = new Vector3(x, y, z);
                }
            }
        }
    }
}
