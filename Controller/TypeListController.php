<?php

namespace DP\PlatformUITypeListBundle\Controller;

use eZ\Bundle\EzPublishCoreBundle\Controller;

class TypeListController extends Controller
{
    public function listAction( $typeIdentifier, $sortMethod, $sortOrder )
    {
        return $this->render(
            'DPPlatformUITypeListBundle:TypeList:list.html.twig',
            array(
                'typeIdentifier' => $typeIdentifier,
                'sortMethod' => $sortMethod,
                'sortOrder' => $sortOrder,
            )
        );
    }
}
