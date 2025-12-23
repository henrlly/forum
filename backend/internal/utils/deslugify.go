package utils

import (
	"strings"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

/*
 * ts implementation
 * export function deslugifyTopicName(slug: string) {
 *   return slug
 *    .split("-")
 *   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
 *   .join(" ");
 * };
 */

func DeslugifyTopicName(slug string) string {
	str := strings.ReplaceAll(slug, "-", " ")
	return cases.Title(language.English).String(str)
}
