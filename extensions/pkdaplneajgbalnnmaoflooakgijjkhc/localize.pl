#!/usr/bin/perl -w
use strict;
use warnings;

use File::Copy;

my @files = <_locales/*.js>;

foreach my $file (@files) {
	print $file . "\n";
	my ($langCode) = $file =~ /\.*locales.(.+)\.js/;
	print $langCode . "\n";
	my $dir = "./_locales/" . $langCode;
	unless (-e $dir) {
		mkdir $dir;
	}
	my $newFile = $dir . "/" . "messages.json";
	print "new file name will be: " . $newFile . "\n\n";
	move($file, $newFile);
}
