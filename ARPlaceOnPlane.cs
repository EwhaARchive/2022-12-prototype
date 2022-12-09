using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
// imports
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARPlaceOnPlane : MonoBehaviour
{
    public ARRaycastManager arRaycaster;    // declare arRaycastManager by public
    public GameObject placeObject;  // object that place 3D object

    GameObject spawnObject; // just for "one" Elephant

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        // call function per each frame

        //UpdateCenterObject();
        PlaceObjectByTouch();
    }

    // place 3D Object in where I touched per each frame
    private void PlaceObjectByTouch()
    {
        // check if touch happened
        if (Input.touchCount > 0)   // touchCount : number of fingers that attach to screen
        {
            Touch touch = Input.GetTouch(0);    // get "first" touch info

            // get return values when Ray hits Plane objects
            // Ray goes to where I "touched"
            List<ARRaycastHit> hits = new List<ARRaycastHit>();
            if (arRaycaster.Raycast(touch.position, hits, TrackableType.Planes))
            {
                Pose hitPose = hits[0].pose;

                // instantiate the spawnObject each time a touch happens
                if (!spawnObject)
                {
                    // create spawnObject
                    spawnObject = Instantiate(placeObject, hitPose.position, hitPose.rotation);
                }
                else
                {
                    // just change the postition of spawnObject
                    spawnObject.transform.position = hitPose.position;
                    spawnObject.transform.rotation = hitPose.rotation;
                }

            }
        }
    }

    // place 3D Object in Center per each frame
    private void UpdateCenterObject()
    {
        Vector3 screenCenter = Camera.current.ViewportToScreenPoint(new Vector3(0.5f, 0.5f));   // get Center point of camera screen

        // get return values when Ray hits Plane objects
        List<ARRaycastHit> hits = new List<ARRaycastHit>();
        arRaycaster.Raycast(screenCenter, hits, TrackableType.Planes);

        // when there are one or more hitted objects
        if (hits.Count > 0)
        {
            Pose placementPose = hits[0].pose;  // position => hitted firstly
            placeObject.SetActive(true);    // set active(visible)
            placeObject.transform.SetPositionAndRotation(placementPose.position, placementPose.rotation);   // set position & rotation
        }
        //else
        //{
        //    placeObject.SetActive(false);
        //}
    }
}
