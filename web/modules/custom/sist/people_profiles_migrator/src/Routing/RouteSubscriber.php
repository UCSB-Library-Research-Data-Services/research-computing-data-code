<?php

namespace Drupal\people_profiles_migrator\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // Override the people_profiles settings form route to use our extended form
    if ($route = $collection->get('people_profiles.default_people_profiles_page_form')) {
      $route->setDefault('_form', '\Drupal\people_profiles_migrator\Form\DefaultPeopleProfilePageForm');
      $route->setDefault('_title', 'People Profiles Settings');
    }
  }

}
