<?php

namespace DP\PlatformUITypeListBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use eZ\Bundle\EzPublishCoreBundle\DependencyInjection\Configuration\SiteAccessAware\ConfigurationProcessor;
use Symfony\Component\Config\Resource\FileResource;

class DPPlatformUITypeListExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritdoc}
     */
    public function load( array $configs, ContainerBuilder $container )
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration( $configuration, $configs );

        $loader = new Loader\YamlFileLoader( $container, new FileLocator( __DIR__ . '/../Resources/config' ) );
        $loader->load( 'services.yml' );

        $processor = new ConfigurationProcessor( $container, 'dp_platformuitypelist' );
    }

    public function prepend( ContainerBuilder $container )
    {
        $container->prependExtensionConfig( 'assetic', array( 'bundles' => array( 'DPPlatformUITypeListBundle' ) ) );

        $this->prependYui( $container );
        $this->prependCss( $container );
    }

    private function prependYui( ContainerBuilder $container )
    {
        $container->setParameter(
            'dp_typelist.public_dir',
            'bundles/dpplatformuitypelist'
        );
        $yuiConfigFile = __DIR__ . '/../Resources/config/yui.yml';
        $config = Yaml::parse( file_get_contents( $yuiConfigFile ) );
        $container->prependExtensionConfig( 'ez_platformui', $config );
        $container->addResource( new FileResource( $yuiConfigFile ) );
    }

    private function prependCss( ContainerBuilder $container )
    {
        $cssConfigFile = __DIR__ . '/../Resources/config/css.yml';
        $config = Yaml::parse( file_get_contents( $cssConfigFile ) );
        $container->prependExtensionConfig( 'ez_platformui', $config );
        $container->addResource( new FileResource( $cssConfigFile ) );
    }
}
