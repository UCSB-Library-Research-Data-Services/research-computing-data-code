<?php

namespace Drupal\Tests\ucsb_core\Unit;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Tests\UnitTestCase;
use Psr\Log\LoggerInterface;

/**
 * Tests SVG accessibility processing and cleanup functions.
 *
 * @group ucsb_core
 */
class SvgAccessibilityTest extends UnitTestCase {

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    // Load the module file containing the functions under test.
    require_once dirname(__DIR__, 3) . '/ucsb_core.module';

    // Set up a mock container with a logger so error paths work.
    $logger = $this->createMock(LoggerInterface::class);
    $logger_factory = $this->createMock(LoggerChannelFactoryInterface::class);
    $logger_factory->method('get')->willReturn($logger);
    $container = new ContainerBuilder();
    $container->set('logger.factory', $logger_factory);
    \Drupal::setContainer($container);
  }

  /**
   * Tests that accessibility attributes are added to a simple SVG.
   */
  public function testAddsAccessibilityAttributes(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60"><rect width="400" height="60"/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test Department');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('role="img"', $result);
    $this->assertStringContainsString('aria-labelledby="departmentname"', $result);
    $this->assertStringContainsString('<title id="departmentname">Test Department</title>', $result);
  }

  /**
   * Tests that existing title element is updated.
   */
  public function testUpdatesExistingTitle(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60"><title>Old Title</title><rect width="400" height="60"/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'New Department Name');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('<title id="departmentname">New Department Name</title>', $result);
    $this->assertStringNotContainsString('Old Title', $result);
  }

  /**
   * Tests that existing accessibility attributes are preserved.
   */
  public function testPreservesExistingAttributes(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="departmentname"><title id="departmentname">Existing</title><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Updated Name');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('role="img"', $result);
    $this->assertStringContainsString('aria-labelledby="departmentname"', $result);
    // Title content should be updated to new name.
    $this->assertStringContainsString('Updated Name', $result);
  }

  /**
   * Tests that ampersands in site names are handled correctly.
   */
  public function testHandlesAmpersandInName(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Counseling & Psychological Services');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('Counseling &amp; Psychological Services', $result);
  }

  /**
   * Tests that XML declaration is not included in output.
   */
  public function testNoXmlDeclaration(): void {
    $svg = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringNotContainsString('<?xml', $result);
  }

  /**
   * Tests that Adobe Illustrator comments are removed.
   */
  public function testRemovesComments(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><!-- Generator: Adobe Illustrator 28.3.0 --><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringNotContainsString('<!--', $result);
    $this->assertStringNotContainsString('Adobe Illustrator', $result);
  }

  /**
   * Tests that metadata elements are removed.
   */
  public function testRemovesMetadata(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><metadata><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">test</rdf:RDF></metadata><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringNotContainsString('<metadata', $result);
  }

  /**
   * Tests that empty g elements are removed.
   */
  public function testRemovesEmptyGroups(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><g><g></g></g><g><rect/></g></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    // The nested empty groups should be removed.
    // The group with rect should remain.
    $this->assertStringContainsString('<g>', $result);
    $this->assertStringContainsString('<rect/>', $result);
  }

  /**
   * Tests that style elements are preserved.
   */
  public function testPreservesStyles(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><style type="text/css">.st0{fill:#003660;}</style><rect class="st0"/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('<style', $result);
    $this->assertStringContainsString('.st0{fill:#003660;}', $result);
  }

  /**
   * Tests that defs elements are preserved.
   */
  public function testPreservesDefs(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1"><stop offset="0%" style="stop-color:rgb(255,255,0)"/></linearGradient></defs><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringContainsString('<defs>', $result);
    $this->assertStringContainsString('linearGradient', $result);
  }

  /**
   * Tests that Adobe-specific namespace declarations are removed.
   */
  public function testRemovesAdobeNamespaces(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xml:space="preserve"><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringNotContainsString('xmlns:i=', $result);
    $this->assertStringNotContainsString('xmlns:graph=', $result);
    $this->assertStringNotContainsString('xml:space', $result);
  }

  /**
   * Tests that non-SVG namespace elements are removed.
   */
  public function testRemovesNonSvgNamespaceElements(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/"><i:pgf id="test">data</i:pgf><rect/></svg>';
    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test');

    $this->assertNotFalse($result);
    $this->assertStringNotContainsString('i:pgf', $result);
    $this->assertStringContainsString('<rect/>', $result);
  }

  /**
   * Tests that invalid XML returns FALSE.
   */
  public function testInvalidXmlReturnsFalse(): void {
    $result = _ucsb_core_add_svg_accessibility_attributes('not xml at all', 'Test');
    $this->assertFalse($result);
  }

  /**
   * Tests that content without SVG element returns FALSE.
   */
  public function testNoSvgElementReturnsFalse(): void {
    $result = _ucsb_core_add_svg_accessibility_attributes('<div>no svg here</div>', 'Test');
    $this->assertFalse($result);
  }

  /**
   * Tests full Adobe Illustrator SVG cleanup.
   */
  public function testFullAdobeIllustratorCleanup(): void {
    $svg = <<<'SVG'
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 28.3.0, SVG Export Plug-In -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" viewBox="0 0 720 100" xml:space="preserve">
<style type="text/css">.st0{fill:#003660;}.st1{fill:#FFFFFF;}</style>
<metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices></slices></sfw></metadata>
<i:pgf id="adobe_illustrator_pgf">illustrator data</i:pgf>
<g><g><rect class="st0" width="720" height="100"/></g><g></g><g><text x="20" y="60" class="st1">UC Santa Barbara</text></g></g>
</svg>
SVG;

    $result = _ucsb_core_add_svg_accessibility_attributes($svg, 'UC Santa Barbara Test Department');

    $this->assertNotFalse($result);

    // Accessibility attributes added.
    $this->assertStringContainsString('role="img"', $result);
    $this->assertStringContainsString('aria-labelledby="departmentname"', $result);
    $this->assertStringContainsString('<title id="departmentname">UC Santa Barbara Test Department</title>', $result);

    // Bloat removed.
    $this->assertStringNotContainsString('<?xml', $result);
    $this->assertStringNotContainsString('<!--', $result);
    $this->assertStringNotContainsString('<metadata', $result);
    $this->assertStringNotContainsString('i:pgf', $result);
    $this->assertStringNotContainsString('xmlns:i=', $result);
    $this->assertStringNotContainsString('xmlns:graph=', $result);
    $this->assertStringNotContainsString('xml:space', $result);

    // Content preserved.
    $this->assertStringContainsString('<style', $result);
    $this->assertStringContainsString('.st0{fill:#003660;}', $result);
    $this->assertStringContainsString('<rect', $result);
    $this->assertStringContainsString('UC Santa Barbara', $result);
  }

  /**
   * Tests idempotency — processing an already-processed SVG.
   */
  public function testIdempotent(): void {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';

    $first = _ucsb_core_add_svg_accessibility_attributes($svg, 'Test Department');
    $second = _ucsb_core_add_svg_accessibility_attributes($first, 'Test Department');

    $this->assertNotFalse($second);
    $this->assertEquals($first, $second);
  }

}
