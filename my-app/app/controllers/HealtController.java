package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

/**
 * Created by SniPierZz on 15/03/16.
 */
public class HealtController extends Controller {

    public Result index() {
        return ok(views.html.healt.render("Your new application is ready."));
    }


}
