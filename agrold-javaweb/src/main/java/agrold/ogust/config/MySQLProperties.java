/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.ogust.config;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @role Allow Developer to edit this class like a Config File for DB connections
 * @author Jc
 */
public class MySQLProperties {

    //private static final String configFilePath = "/home/virtuoso/agrold-mysql.conf"; // en ligne i.e. sur volvestre
    //private static final String configFilePath = "/Users/plarmande/workspace2015/agrold-mysql.conf"; // en localhost
    private static final String configFilePath = "/home/tagny/Documents/agrold/doc/agrold/agrold-mysql.conf"; // en localhost
    private static final List<String> conf = readLoginConfigurations();
    private static final String url = "jdbc:mysql://" + conf.get(0);
    private static final String driver = "com.mysql.jdbc.Driver";
    private static final String utilisateur = conf.get(1);
    private static final String motDePasse = conf.get(2);

    
    private MySQLProperties(){
        /* prevent usage of constructor bcause it's a static class */
    }
    
    
    /**
     *
     * @return an ArrayList of String with the lines of the text in the same
     * order as in the text
     */
    public static List<String> readLoginConfigurations() {
        List<String> lines = new ArrayList<>();
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(new File(configFilePath)));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                if (!line.equals("")) {
                    lines.add(line.trim());
                }
            }
            bufferedReader.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(MySQLProperties.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(MySQLProperties.class.getName()).log(Level.SEVERE, null, ex);
        }
        return lines;
    }
    
    public static String getUrl() {
        return url;
    }

    public static String getDriver() {
        return driver;
    }

    public static String getUtilisateur() {
        return utilisateur;
    }

    public static String getMotDePasse() {
        return motDePasse;
    }
    
    
}
