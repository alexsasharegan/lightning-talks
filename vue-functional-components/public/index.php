<?php

$entries = glob(__DIR__.'/*.html');

echo "<u>";
echo "<ul>";
echo array_reduce($entries, function($html, $path) {
  $short = basename($path);
  $link = "<a href=\"/$short\">$short</a>";
  return $html."<li>$link</li>";
}, "");
echo "</ul>";
echo "</pre>";
