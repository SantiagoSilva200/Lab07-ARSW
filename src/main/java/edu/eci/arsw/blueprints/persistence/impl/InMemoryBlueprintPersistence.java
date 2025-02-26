package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final Map<String, Blueprint> blueprints = new HashMap<>();

    public InMemoryBlueprintPersistence() {
        Point[] points1 = {new Point(10, 10), new Point(20, 20)};
        Blueprint bp1 = new Blueprint("author1", "blueprint1", points1);

        Point[] points2 = {new Point(30, 30), new Point(40, 40)};
        Blueprint bp2 = new Blueprint("author1", "blueprint2", points2);

        Point[] points3 = {new Point(50, 50), new Point(60, 60)};
        Blueprint bp3 = new Blueprint("author2", "blueprint3", points3);

        blueprints.put("author1_blueprint1", bp1);
        blueprints.put("author1_blueprint2", bp2);
        blueprints.put("author2_blueprint3", bp3);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        String key = bp.getAuthor() + "_" + bp.getName();
        if (blueprints.containsKey(key)) {
            throw new BlueprintPersistenceException("Blueprint already exists: " + key);
        }
        blueprints.put(key, bp);
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        String key = author + "_" + bprintname;
        if (!blueprints.containsKey(key)) {
            throw new BlueprintNotFoundException("Blueprint not found: " + key);
        }
        return blueprints.get(key);
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintPersistenceException, BlueprintNotFoundException {
        Set<Blueprint> authorBlueprints = new HashSet<>();
        for (Map.Entry<String, Blueprint> entry : blueprints.entrySet()) {
            if (entry.getKey().startsWith(author + "_")) {
                authorBlueprints.add(entry.getValue());
            }
        }
        if (authorBlueprints.isEmpty()) {
            throw new BlueprintNotFoundException("No blueprints found for author: " + author);
        }
        return authorBlueprints;
    }

    @Override
    public Set<Blueprint> getAllBluePrints() throws BlueprintPersistenceException {
        return new HashSet<>(blueprints.values());
    }
}