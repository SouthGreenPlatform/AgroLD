/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package agrold.webservices;

import org.glassfish.jersey.logging.LoggingFeature;
import org.glassfish.jersey.server.ResourceConfig;
 
public class AuthentificationFilterRegister extends ResourceConfig
{
    public AuthentificationFilterRegister()
    {
        packages("agrold.webservices");
        register(LoggingFeature.class);
        register(GsonMessageBodyHandler.class);
 
        //Register Auth Filter here
        register(AuthenticationFilter.class);
    }
}