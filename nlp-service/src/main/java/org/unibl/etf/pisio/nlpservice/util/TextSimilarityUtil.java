package org.unibl.etf.pisio.nlpservice.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class TextSimilarityUtil {

    private static final Set<String> STOP_WORDS = Set.of(
            "i", "a", "ali", "da", "je", "su", "se", "u", "na", "sa", "kod",
            "od", "do", "za", "po", "iz", "uz", "o", "te", "to", "ta", "taj",
            "ovo", "ono", "jedan", "jedna", "jedno", "ima", "nema", "bio", "bila"
    );

    private TextSimilarityUtil() {
    }

    public static double calculateSimilarity(String text1, String text2) {
        Set<String> set1 = tokenize(text1);
        Set<String> set2 = tokenize(text2);

        if (set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    private static Set<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Set.of();
        }

        String normalized = text.toLowerCase()
                .replaceAll("[^a-zA-ZčćžšđČĆŽŠĐ0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        return Arrays.stream(normalized.split(" "))
                .map(String::trim)
                .filter(token -> !token.isBlank())
                .filter(token -> token.length() > 2)
                .filter(token -> !STOP_WORDS.contains(token))
                .collect(Collectors.toSet());
    }
}