package models;

/**
 * Created by SniPierZz on 14/05/16.
 */

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Users extends Model {

    public Integer stress;

    public Integer bpm;

    public Integer sex;

    public Integer smoker;

    @Id
    public Date id = new Date();

}