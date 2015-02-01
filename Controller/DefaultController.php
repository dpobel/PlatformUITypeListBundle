<?php

namespace DP\PlatformUITypeListBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('DPPlatformUITypeListBundle:Default:index.html.twig', array('name' => $name));
    }
}
